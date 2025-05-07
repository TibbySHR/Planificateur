import pytest
import urllib
from fastapi import status

# replacement of @pytest.mark.anyio decorator
pytestmark = pytest.mark.anyio


async def test_fetch_program(async_client):
    """
    Test case for fetching a program.

    Args:
        async_client: The async client for making HTTP requests.

    Returns:
        None

    Raises:
        AssertionError: If the response status code is not 200 or if the fetched program ID is not as expected.
    """
    response = await async_client.get(
        f"/api/v1/programs?{urllib.parse.urlencode({'programs_list': ['105010']})}",
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0]["_id"] == "105010"


async def test_fetch_program_many(async_client):
    """
    Test case for fetching multiple programs.

    This test sends a GET request to the '/api/v1/programs' endpoint with multiple program codes as parameters.
    It then asserts that the response status code is 200 (OK) and that the number of programs returned in the response is 2.
    """
    response = await async_client.get(
        f"/api/v1/programs?{urllib.parse.urlencode({'programs_list': ['105010', '105020']})}",
    )
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 2


async def test_invalid_program(async_client):
    """
    Test case for fetching an invalid program.

    This test sends a GET request to the '/api/v1/programs' endpoint with an invalid program code as a parameter.
    It then asserts that the response status code is 400 (Bad Request).
    """
    response = await async_client.get(
        f"/api/v1/programs?{urllib.parse.urlencode({'programs_list': ['invalid']})}",
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
