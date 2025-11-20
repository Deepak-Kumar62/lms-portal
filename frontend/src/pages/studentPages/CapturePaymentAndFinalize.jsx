import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { captureAndFinalizePayment } from '@/services/orderService';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const CapturePaymentAndFinalize = () => {
    const [status, setStatus] = useState("processing")
    // change manually for UI preview: "processing" | "success" | "failed"

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");

    const navigate = useNavigate()

    useEffect(() => {
        if (paymentId && payerId) {
            async function capturePayment() {
                try {
                    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

                    const response = await captureAndFinalizePayment(
                        paymentId,
                        payerId,
                        orderId
                    );

                    if (response?.data?.success) {
                        sessionStorage.removeItem("currentOrderId");
                        setStatus("success")
                    } else {
                        setStatus("failed")
                    }
                } catch (error) {
                    setStatus("failed")
                }
            }
            capturePayment();
        }
    }, [payerId, paymentId]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md text-center shadow-xl rounded-2xl border border-blue-200 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-blue-700">
                        {status === "processing" && "Processing Payment..."}
                        {status === "success" && "Payment Successful!"}
                        {status === "failed" && "Payment Failed"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-4 pb-8">
                    {status === "processing" && (
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    )}
                    {status === "success" && (
                        <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
                    )}
                    {status === "failed" && (
                        <XCircle className="w-12 h-12 text-red-500 animate-pulse" />
                    )}

                    {status === "processing" && (
                        <p className="text-gray-600">
                            Confirming your PayPal payment. Please wait...
                        </p>
                    )}
                    {status === "success" && (
                        <p className="text-gray-600">
                            Your payment has been successfully completed! 🎉
                        </p>
                    )}
                    {status === "failed" && (
                        <p className="text-gray-600">
                            Oops! Something went wrong while processing your payment.
                        </p>
                    )}

                    {status === "success" && (
                        <button
                            className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                            onClick={() => navigate("/home")}
                        >
                            Go to Home Page
                        </button>
                    )}

                    {status === "failed" && (
                        <button
                            className="mt-4 px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                            onClick={() => navigate("/home")}
                        >
                            Go to Home Page
                        </button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default CapturePaymentAndFinalize