import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get, where } from "../firebase/helper";
import { timestampToDateStringConverter } from "../helpers/TimestampToStringConverter";

export default function TransactionDetails() {
  const { reference } = useParams();

  const [transactions, setTransactions] = useState([]);
  const [info, setInfo] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!reference) return;

    async function r() {
      const snap = await get(
        "bookings",
        where("commissionReference", "==", reference)
      );
      let e = 0;
      let hasInfo = false;
      setTransactions(
        snap.docs.map((v) => {
          const data = v.data();

          const price = parseInt(data.price);
          const commission = parseInt(price * 0.15);
          e += commission;

          if (!hasInfo) {
            setInfo({
              date: timestampToDateStringConverter(data.paidCommissionAt),
              name: data.providerName,
              status: data.commissionStatus,
            });
            hasInfo = true;
          }

          return {
            id: v.id,
            date: timestampToDateStringConverter(data.paidCommissionAt),
            price: price,
            task: data.task,
            commission: commission,
            status: data.commissionStatus,
          };
        })
      );
      setTotal(e);
    }

    r();
  }, []);

  return (
    <div>
      <h2
        style={{ display: "flex", justifyContent: "center", marginBottom: 15 }}
      >
        Transaction Details
      </h2>

      {transactions.map((transaction) => (
        <div key={transaction.id} className="transaction-card">
          <div>{info?.date}</div>
          <div>{info?.name}</div>
          <b>Service Type: {transaction.task}</b>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Service Amount:</div>
            <b>₱{transaction.price}</b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Commission (15%):</div>
            <b>₱{transaction.commission}</b>
          </div>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 15,
          width: "100%",
        }}
      >
        <b>Total Commission:</b>
        <b>₱{total}</b>
      </div>
    </div>
  );
}
