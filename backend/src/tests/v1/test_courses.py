# TODO: Write tests for the courses endpoint
import pytest
import urllib
from fastapi import status

# replacement of @pytest.mark.anyio decorator
pytestmark = pytest.mark.anyio


async def test_fetch_course(async_client):
    """
    Test case for fetching a course.

    Args:
        async_client: The async client for making HTTP requests.

    Returns:
        None

    Raises:
        AssertionError: If the response status code is not 200 or if the fetched course ID is not as expected.
    """
    response = await async_client.get(
        f"/api/v1/courses?{urllib.parse.urlencode({'courses_list': ['ift6253']})}",
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0]["_id"] == "IFT6253"


async def test_uppercase_course_id(async_client):
    """
    Test case to check if the course ID can be Uppercase too.

    Args:
        async_client: The async HTTP client for making requests.

    Returns:
        None
    """
    response = await async_client.get(
        f"/api/v1/courses?{urllib.parse.urlencode({'courses_list': ['AME6090']})}",
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()[0]["_id"] == "AME6090"


async def test_fetch_course_many(async_client):
    """
    Test case for fetching multiple courses.

    This test sends a GET request to the '/api/v1/courses' endpoint with multiple course codes as parameters.
    It then asserts that the response status code is 200 (OK) and that the number of courses returned in the response is 2.
    """
    response = await async_client.get(
        f"/api/v1/courses?{urllib.parse.urlencode({'courses_list': ['ift6253', 'ame6090']})}",
    )
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 2


async def test_invalid_course(async_client):
    """
    Test case for retrieving an invalid course.

    This test sends a GET request to the '/api/v1/courses' endpoint with an invalid course ID.
    It expects the server to respond with a 400 Bad Request status code.

    Args:
        async_client (TestClient): The async test client fixture.

    Returns:
        None
    """
    response = await async_client.get(
        f"/api/v1/courses?{urllib.parse.urlencode({'courses_list': ['invalid']})}",
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
