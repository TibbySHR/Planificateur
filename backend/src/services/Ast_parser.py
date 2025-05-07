from typing import Union, Set
from dataclasses import dataclass


@dataclass
class SetLiteral:
    value: Set


@dataclass
class UnionOp:
    left: "AST"
    right: "AST"


@dataclass
class IntersectionOp:
    left: "AST"
    right: "AST"


@dataclass
class DifferenceOp:
    left: "AST"
    right: "AST"


def parse(tokens):
    pos = 0

    def peek():
        return tokens[pos] if pos < len(tokens) else None

    def eat(expected=None):
        nonlocal pos
        tok = peek()
        if expected is not None and tok != expected:
            raise SyntaxError(f"Expected {expected}, got {tok}")
        pos += 1
        return tok

    def parse_expr():
        return parse_union()

    def parse_union():
        node = parse_intersection()
        while True:
            tok = peek()
            if isinstance(tok, set) or tok == "(":
                right = parse_intersection()
                node = UnionOp(left=node, right=right)
            else:
                break
        return node

    def parse_intersection():
        node = parse_difference()
        while peek() == "&":
            eat("&")
            right = parse_difference()
            node = IntersectionOp(left=node, right=right)
        return node

    def parse_difference():
        node = parse_primary()
        while peek() == "\\":
            eat("\\")
            right = parse_primary()
            node = DifferenceOp(left=node, right=right)
        return node

    def parse_primary():
        tok = peek()
        if tok == "(":
            eat("(")
            node = parse_expr()
            eat(")")
            return node
        elif isinstance(tok, set):
            return SetLiteral(eat())
        raise SyntaxError(f"Unexpected token: {tok}")

    # Start parsing from top-level expression
    result = parse_expr()

    # Check for leftover tokens
    if peek() is not None:
        raise SyntaxError(f"Unexpected trailing token: {peek()}")

    return result


AST = Union[SetLiteral, UnionOp, IntersectionOp, DifferenceOp]


def evaluate(ast):
    if isinstance(ast, SetLiteral):
        return ast.value
    elif isinstance(ast, UnionOp):
        return evaluate(ast.left) | evaluate(ast.right)
    elif isinstance(ast, IntersectionOp):
        return evaluate(ast.left) & evaluate(ast.right)
    elif isinstance(ast, DifferenceOp):
        return evaluate(ast.left) - evaluate(ast.right)
    else:
        raise TypeError(f"Unknown AST node: {ast}")
