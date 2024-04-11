import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import { createOrder } from '../../services/apiRestaurant'
import Input from '../../UI/Input'
import Button from '../../UI/Button'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice'
import EmptyCart from '../cart/EmptyCart'
import store from '../../store'
import { formatCurrency } from '../../utils/helpers'
import { useState } from 'react'
import { fetchAddress } from '../user/userSlice'

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str
    )

const CreateOrder = () => {
    const [withPriority, setWithPriority] = useState(false)
    const {
        username,
        status: addressStatus,
        position,
        address,
        error: errorAddress,
    } = useSelector((state) => state.user)
    const isLoadingAddress = addressStatus === 'loading'

    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'

    const formErrors = useActionData()
    const dispatch = useDispatch()

    const cart = useSelector(getCart)
    const totalCartPrice = useSelector(getTotalCartPrice)
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0
    const totalPrice = totalCartPrice + priorityPrice

    if (!cart.length) return <EmptyCart />
    return (
        <div className="px-4 py-6">
            <h2 className="mb-8 text-xl font-semibold">
                Ready to order? Let's go!
            </h2>

            <Form method="POST">
                <div
                    className="sm: mb-5 flex 
                flex-col items-center gap-2 sm:flex-row sm:items-center"
                >
                    <label className="sm:basis-40">First Name</label>
                    <Input
                        type="text"
                        name="customer"
                        defaultValue={username}
                        required
                        isGrow
                    />
                </div>

                <div
                    className="sm: mb-5 flex 
                flex-col items-center gap-2 sm:flex-row sm:items-center"
                >
                    <label className="sm:basis-40">Phone number</label>
                    <div className="grow">
                        <Input type="tel" name="phone" required fullWidth />
                        {formErrors?.phone && (
                            <p
                                className="mt-2 rounded-md bg-red-100 px-3 py-2 
                            text-xs text-red-700"
                            >
                                {formErrors.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div
                    className="relative mb-5 flex flex-col items-center gap-2
                 sm:flex-col sm:items-center md:flex-row lg:flex-row"
                >
                    <label className="sm:basis-40">Address</label>
                    <div className="grow">
                        <Input
                            type="text"
                            name="address"
                            disabled={isLoadingAddress}
                            defaultValue={address}
                            required
                            fullWidth
                        />
                        {addressStatus === 'error' && (
                            <p
                                className="mt-2 rounded-md bg-red-100 px-3 py-2 
                            text-xs text-red-700"
                            >
                                {errorAddress}
                            </p>
                        )}
                    </div>

                    {!position.latitude && !position.longitude && (
                        <span
                            className=" right-[3px] top-[3px] z-50 sm:static sm:right-[3px]
                          sm:top-[34px] md:absolute md:right-[5px] md:top-[5px]"
                        >
                            <Button
                                disabled={isLoadingAddress}
                                type="small"
                                onClick={(e) => {
                                    e.preventDefault()
                                    dispatch(fetchAddress())
                                }}
                            >
                                Get position
                            </Button>
                        </span>
                    )}
                </div>

                <div className="mb-12 flex items-center gap-5">
                    <input
                        className="h-6 w-6 accent-yellow-400
                        focus:outline-none focus:ring focus:ring-yellow-400
                        focus:ring-offset-2"
                        type="checkbox"
                        name="priority"
                        id="priority"
                        value={withPriority}
                        onChange={(e) => setWithPriority(e.target.checked)}
                    />
                    <label htmlFor="priority" className="font-medium">
                        Want to yo give your order priority?
                    </label>
                </div>

                <div>
                    <input
                        type="hidden"
                        name="cart"
                        value={JSON.stringify(cart)}
                    />
                    <input
                        type="hidden"
                        name="position"
                        value={
                            position.longitude && position.latitude
                                ? `${position.latitude}, ${position.longitude}`
                                : ''
                        }
                    />
                    <Button
                        disabled={isSubmitting || isLoadingAddress}
                        type="primary"
                    >
                        {isSubmitting
                            ? 'Placing order...'
                            : `Order now from ${formatCurrency(totalPrice)}`}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export const action = async ({ request }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === 'true',
    }

    const errors = {}
    if (!isValidPhone(order.phone))
        errors.phone =
            'Please give us your correct phone number. We might need it to contact you'

    if (Object.keys(errors).length > 0) return errors

    const newOrder = await createOrder(order)

    store.dispatch(clearCart())

    return redirect(`/order/${newOrder.id}`)
}

export default CreateOrder
