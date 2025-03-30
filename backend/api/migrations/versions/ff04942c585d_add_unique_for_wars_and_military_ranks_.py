"""Add unique for wars and military ranks tables

Revision ID: ff04942c585d
Revises: 3a33dc9c4537
Create Date: 2025-03-27 13:03:47.531812

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ff04942c585d'
down_revision: Union[str, None] = '3a33dc9c4537'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
