import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const PaymentCancel = () => {
    const navigate = useNavigate()
    return (
        <div className='w-full min-h-screen flex justify-center items-center'>
            <div className='flex flex-col justify-center'>
                <h2 className='mb-5 text-3xl'>Your payment has been cancelled</h2>
                <Button
                    onClick={() => {
                        navigate("/home")
                    }}
                >Go to Home Page</Button>
            </div>
        </div>
    )
}

export default PaymentCancel