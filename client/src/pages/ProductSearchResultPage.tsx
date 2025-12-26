import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { SyncLoader } from "react-spinners";
import PageContainer from "../components/ui/PageContainer";
import Header from "../components/Header";
import Card from "../components/ui/Card";
import "./admin/ui/productsearch.css";

const ProductSearchResultPage: React.FC = () => {
  const [params] = useSearchParams();
  const model = params.get("model") ?? "";

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  // Fake fetch for now (MVP)
  useEffect(() => {
    setTimeout(() => {
      setResult({
        model,
        price: "—",
        condition: "—",
        imageUrl: "",
      });
      setLoading(false);
    }, 800);
  }, [model]);

  return (
    <>
      <Header />
      <PageContainer>
        {loading ? (
          <div className="ps-load">
            <SyncLoader size={14} color="#000" />
          </div>
        ) : (
          <>
            <h1 className="ps-title">{model}</h1>

            <Card className="ps-card">
              <p><strong>Model:</strong> {result.model}</p>
              <p><strong>Price:</strong> {result.price}</p>
              <p><strong>Condition:</strong> {result.condition}</p>
            </Card>

            <p className="ps-note">
              This product isn't available yet.  
              You’ll be notified when it appears in stock.
            </p>
          </>
        )}
      </PageContainer>
    </>
  );
};

export default ProductSearchResultPage;