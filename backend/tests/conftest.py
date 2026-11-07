import sys
from pathlib import Path

import pytest

BACKEND = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND))

from fastapi.testclient import TestClient  # noqa: E402

import main  # noqa: E402


@pytest.fixture(scope="session")
def client():
    with TestClient(main.app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
def leaf_jpg() -> bytes:
    return (BACKEND / "test-leaf.jpg").read_bytes()
