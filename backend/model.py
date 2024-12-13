from pydantic import BaseModel
from typing import Dict

class StudentModel(BaseModel):
    name: str
    age: int
    address: Dict[str, str]

class StudentResponse(BaseModel):
    id: str
    name: str
    age: int
    address: Dict[str, str]
