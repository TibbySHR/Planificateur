import pytest


@pytest.mark.anyio
async def test_main(async_client):
    response = await async_client.get("/api/v1/courses")
    assert response.status_code == 200
