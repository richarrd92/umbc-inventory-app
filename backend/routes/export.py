from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from database import get_db
import csv
from io import StringIO
import models

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/inventory")
def export_inventory_csv(db: Session = Depends(get_db)):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Item ID", "Name", "Category", "Quantity", "Restock Threshold"])

    # FILTER OUT SOFT-DELETED ITEMS
    items = db.query(models.Item).filter(models.Item.deleted_at == None).all()

    for item in items:
        writer.writerow([item.id, item.name, item.category, item.quantity, item.restock_threshold])

    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=inventory_report.csv"
    })

@router.get("/orders")
def export_orders_csv(db: Session = Depends(get_db)):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Order ID", "Created At", "Submitted", "Submitted At", "Created By", "Item Name", "Final Quantity"])

    # FILTER OUT SOFT-DELETED ORDERS
    orders = db.query(models.Order).filter(models.Order.deleted_at == None).all()

    for order in orders:
        for order_item in order.order_items:
            # FILTER OUT SOFT-DELETED ORDER ITEMS
            if order_item.deleted_at is None:
                writer.writerow([
                    order.id,
                    order.created_at,
                    order.submitted,
                    order.submitted_at,
                    order.created_by.name if order.created_by else "Unknown",
                    order_item.item.name if order_item.item else "Unknown",
                    order_item.final_quantity
                ])

    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=restock_orders.csv"
    })


@router.get("/transactions")
def export_transactions_csv(db: Session = Depends(get_db)):
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["Transaction ID", "Item Name", "Type", "Quantity", "User", "Date"])

    # FILTER OUT SOFT-DELETED TRANSACTIONS
    transactions = db.query(models.Transaction).filter(models.Transaction.deleted_at == None).all()

    for tx in transactions:
        for t_item in tx.transaction_items:
            # ALSO FILTER OUT DELETED TRANSACTION ITEMS
            if t_item.deleted_at is None:
                writer.writerow([
                    tx.id,
                    t_item.item.name if t_item.item else "Unknown",
                    tx.transaction_type,
                    t_item.quantity,
                    tx.user.name if tx.user else "Unknown",
                    tx.created_at
                ])

    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=transactions_report.csv"
    })
