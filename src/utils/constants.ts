import { type BillItemType } from "./common-types";

const quote = 'பகுத்துண்டு பல்லுயிர் ஓம்புதல்'

export function generatePrintContent(billItems: BillItemType[], totalAmount: number) {
    return `
      <html>
  <head>
    <title>Bill</title>
    <style>
      /* Styles for the bill */
      body {
        font-family: monospace;
        padding: 0;
        font-size: 15px;
        font-weight: 600;
        -webkit-font-smoothing: none; /* Disable font smoothing */
        font-smoothing: none;
        width: 80mm; /* Set width to 72mm */
      }
      @media print {
        body {
          margin: 0;
          padding: 1mm; /* Add padding for better visual appearance */
        }
      }
      .bill {
        border: 1px solid #ccc;
        padding: 2mm;
        max-width: 72mm;
        margin: 0 auto;
      }
      .restaurant-name {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
      }
      .center {
        margin-top: 5px;
        text-align: center;
      }
      .bill-items {
        margin-bottom: 20px;
      }
      .bill-items table {
        width: 100%;
        border-collapse: collapse;
      }
      .bill-items th, .bill-items td {
        padding: 5px 0;
        text-align: left;
      }
      .item-separator {
        // border-bottom: 1px dashed #000;
      }
      .total {
        font-weight: bold;
        text-align: right;
        padding-top: 10px;
      }
      .personal-message {
        font-size: 14px;
        font-style: italic;
        text-align: center;
        margin-top: 5px;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        margin-top: 5px;
      }
    </style>
  </head>
  <body>
    <div class="bill">
    <img src="./coffeehouselogo.jpg" alt="Restaurant Logo" style="display: block; margin: 0 auto; max-width: 70%;" />
    <div class="restaurant-name">Edaikazhinadu Coffee House</div>
    <div class="center item-separator" style="margin-bottom: 2px;font-size: 14px;"><span>Vilambur, ECR, Phone: 9715019994</span></div>
  
      <div class="bill-items">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Rs</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${billItems
        .map(
          (item) => `
                  <tr class="item-separator">
                    <td style="font-weight: 600;">${item.item.title?.toUpperCase()}</td>
                    <td style="text-align: center;font-weight: 600;">${item.quantity}</td>
                    <td style="text-align: right;font-weight: 600;">${item.item.price != null ? Number(item.item.price) : 0}</td>
                    <td style="text-align: right;font-weight: 600;">${item.item.price != null
              ? Number(item.item.price) * Number(item.quantity)
              : 0}</td>
                  </tr>
                `
        )
        .join("")}
          </tbody>
        </table>
      </div>
      <div class="total">
        Total: ${totalAmount}
      </div>
      
      <div class="personal-message">
        ${quote}
      </div>
      
      <div class="footer">
      - @edaikazhinadu_coffee_house -
      </div>
    </div>
    <script>
      // Automatically trigger print dialog when the window loads
      window.onload = function() {
        function getCurrentDateTime() {
          const now = new Date();
          const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
          return now.toLocaleDateString('en-US', options);
        }
    
        // Insert the current date and time into the bill
        const currentDate = getCurrentDateTime();
        const dateTimeElement = document.createElement('div');
        dateTimeElement.innerText = currentDate;
        dateTimeElement.classList.add('center');
        dateTimeElement.classList.add('item-separator');
        document.querySelector('.bill').insertBefore(dateTimeElement, document.querySelector('.restaurant-name'));
    
        // Trigger print dialog after modifying the bill content
        window.print();
      };
    </script>
  </body>
  </html>
      `;
  }