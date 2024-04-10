import { useLoaderData } from 'react-router-dom'
import { getMenu } from '../../services/apiRestaurant'
import MenuItem from './MenuItem'

const Menu = () => {
    const menu = useLoaderData()
    return (
        <ul className="mb-11 divide-y divide-stone-200 px-2">
            {menu.map((pizza) => (
                <MenuItem pizza={pizza} key={pizza.id} />
            ))}
        </ul>
    )
}

export const loader = async () => {
    const menu = await getMenu()
    return menu
}

export default Menu
