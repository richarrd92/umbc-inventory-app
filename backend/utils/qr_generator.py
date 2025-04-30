import qrcode
import json
from io import BytesIO

def generate_order_qr(transaction_data: dict) -> bytes:
    """
    Generate a QR code image (PNG bytes) that encodes the given transaction data in JSON format.

    Args:
        transaction_data (dict): The transaction data to encode in the QR code.

    Returns:
        bytes: The generated QR code as PNG image bytes.
    """
    # Convert the transaction data to a JSON-formatted string.
    json_data = json.dumps(transaction_data, indent=2)
    
    # Create a QRCode object with a moderate error-correction level.
    qr = qrcode.QRCode(
        version=None,  # Automatically determine the size
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(json_data)
    qr.make(fit=True)
    
    # Generate the image in memory using Pillow.
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save the image to a bytes buffer.
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    
    return buf.getvalue()
