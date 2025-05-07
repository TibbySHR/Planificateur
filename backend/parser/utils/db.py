import logging
import pymongo as pm
from dotenv import load_dotenv
import os

load_dotenv()


class DB:
    def __init__(self, database, logger=None):
        self.db = database
        self.logger = logger or logging.getLogger(__name__)

    def insert(self, data):
        raise NotImplementedError

    def insert_many(self, data):
        raise NotImplementedError

    def close(self):
        raise NotImplementedError


class MongoDB(DB):
    """
    A class representing a MongoDB database connection.

    Args:
        uri (str, optional): The MongoDB connection URI. If not provided, it will default to the value of the MONGO_URI environment variable or "mongodb://localhost:27017/".
        db_name (str, optional): The name of the database. If not provided, it will default to the value of the MONGO_DB_NAME environment variable or "test".
        collection_name (str, optional): The name of the collection. If not provided, it will default to the value of the MONGO_COLLECTION_NAME environment variable or "test".

    Attributes:
        client: A MongoClient instance representing the MongoDB client.
        db: A Database instance representing the MongoDB database.
        collection: A Collection instance representing the MongoDB collection.

    Methods:
        insert(data): Inserts a single document into the collection.
        insert_many(data): Inserts multiple documents into the collection.
        close(): Closes the MongoDB client connection.
    """

    def __init__(self, uri=None, db_name=None, collection_name=None, logger=None):
        self.logger = logger or logging.getLogger(__name__)
        try:
            self.logger.info("Connecting to MongoDB")
            self.client = pm.MongoClient(
                uri or os.getenv("MONGO_URL", "mongodb://localhost:27017/"),
                serverSelectionTimeoutMS=3000,
            )
            self.client.server_info()
            self.db = self.client[
                db_name or os.getenv("MONGO_DB_NAME", "planificateur-academique")
            ]
            self.collection = self.db[
                collection_name or os.getenv("MONGO_COLLECTION_NAME", "courses")
            ]
            self.logger.info("Connected to MongoDB")
            super().__init__(database=self.db, logger=self.logger)
        except Exception as e:
            self.logger.error(f"Error connecting to MongoDB: {e}")
            exit(1)

    def insert(self, data):
        """
        Inserts a single document into the collectioif isinstance(self.database, Neo4jDB):
            return self.database.generate_query(file)
        elif isinstance(self.database, MongoDB):
            return self.database.generate_query(file)n.

        Args:
            data: The document to be inserted.
        """
        try:
            self.collection.insert_one(data)
            self.logger.info("Document inserted successfully")
        except Exception as e:
            self.logger.error(f"Error inserting document: {e}")

    def insert_many(self, data):
        """
        Inserts multiple documents into the collection.

        Args:
            data: A list of documents to be inserted.
        """
        try:
            self.collection.insert_many(data)
            self.logger.info(f"{len(data)} Documents inserted successfully")
        except Exception as e:
            self.logger.error(f"Error inserting documents: {e}")

    def drop(self):
        """
        Drops the collection.
        """
        try:
            self.collection.drop()
            self.logger.info("Collection dropped successfully")
        except Exception as e:
            self.logger.error(f"Error dropping collection: {e}")

    def set_collection(self, collection_name):
        """
        Sets the collection to the specified collection name.

        Args:
            collection_name (str): The name of the collection.
        """
        self.collection = self.db[collection_name]
        self.logger.info(f"Collection set to: {collection_name}")

    def close(self):
        """
        Closes the MongoDB client connection.
        """
        self.client.close()
        self.logger.info("Connection to MongoDB closed")
