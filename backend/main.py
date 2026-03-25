import asyncio
import sqlite3
from collections import deque
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class NodePayload(BaseModel):
    id: str
    type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class EdgePayload(BaseModel):
    source: str
    target: str


class PipelinePayload(BaseModel):
    nodes: List[NodePayload]
    edges: List[EdgePayload]


DB_PATH = Path(__file__).with_name('pipeline_metrics.db')


def initialize_database() -> None:
    with closing(sqlite3.connect(DB_PATH)) as connection:
        cursor = connection.cursor()
        cursor.execute(
            '''
            CREATE TABLE IF NOT EXISTS parse_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL,
                num_nodes INTEGER NOT NULL,
                num_edges INTEGER NOT NULL,
                is_dag INTEGER NOT NULL
            )
            '''
        )
        cursor.execute(
            'CREATE INDEX IF NOT EXISTS idx_parse_history_created_at ON parse_history(created_at)'
        )
        cursor.execute(
            'CREATE INDEX IF NOT EXISTS idx_parse_history_is_dag ON parse_history(is_dag)'
        )
        connection.commit()


def store_parse_result(num_nodes: int, num_edges: int, is_dag_result: bool) -> None:
    with closing(sqlite3.connect(DB_PATH)) as connection:
        cursor = connection.cursor()
        cursor.execute(
            '''
            INSERT INTO parse_history (created_at, num_nodes, num_edges, is_dag)
            VALUES (?, ?, ?, ?)
            ''',
            (
                datetime.now(timezone.utc).isoformat(),
                num_nodes,
                num_edges,
                int(is_dag_result),
            ),
        )
        connection.commit()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
async def read_root():
    return {'Ping': 'Pong'}


@app.on_event('startup')
async def startup() -> None:
    await asyncio.to_thread(initialize_database)

def is_dag(node_ids: Set[str], edges: List[EdgePayload]) -> bool:
    in_degree = {node_id: 0 for node_id in node_ids}
    adjacency = {node_id: [] for node_id in node_ids}

    for edge in edges:
        if edge.source not in node_ids or edge.target not in node_ids:
            continue
        adjacency[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    queue = deque([node_id for node_id, degree in in_degree.items() if degree == 0])
    visited = 0

    while queue:
        current = queue.popleft()
        visited += 1
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


@app.post('/pipelines/parse')
async def parse_pipeline(pipeline: PipelinePayload):
    node_ids = {node.id for node in pipeline.nodes}
    node_count = len(node_ids)
    edge_count = len(pipeline.edges)
    dag_result = is_dag(node_ids, pipeline.edges)

    await asyncio.to_thread(store_parse_result, node_count, edge_count, dag_result)

    return {
        'num_nodes': node_count,
        'num_edges': edge_count,
        'is_dag': dag_result,
    }
