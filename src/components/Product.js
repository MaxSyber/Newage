import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'

const Product = ({ item, provider, account, newage, togglePop }) => {
  const [order, setOrder] = useState(null)
  const [hasBought, setHasBought] = useState(false)
  const fetchDetails = async () => {
    const events = await newage.queryFilter("Buy")
    const orders = events.filter(
      (event) => event.args.buyer === account && event.args.itemId.toString() === item.id.toString()
    )

    if (orders.length === 0) return

    const order = await newage.orders(account, orders[0].args.orderId)
    setOrder(order)
  }

  const buyHandler = async () => {
    const signer = await provider.getSigner()
    let transaction = await newage.connect(signer).buy(item.id, { value: item.cost})
    await transaction.wait()

    setHasBought(true)
  }

  useEffect(() => {
    fetchDetails()
  }, [hasBought])

  return (
    <div className="product">
      <div className="product__details">
        <div className="product__image">
          <img src={item.image} alt="product" />
        </div>
        <div className="product__overview">
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr />
          <p>{item.address}</p>
          <h2>{ethers.utils.formatUnits(item.cost.toString(),'ether')} ETH </h2>
          <hr />
          <p>
            {item.description}
            These captivating images showcases a series of unique and mesmerizing pieces, 
            each meticulously generated using the cutting-edge DALL·E 2 technology.  
            Upon purchase, patrons can anticipate the arrival of a stunning 3ft x 3ft poster, meticulously crafted 
            from their chosen piece, delivered directly to their specified address, transforming a digital masterpiece 
            into a tangible and impactful display of art!
          </p>
        </div>

        <div className="product__order">
        <h1>{ethers.utils.formatUnits(item.cost.toString(),'ether')} ETH </h1>
        <p>
          Free Delivery <br />
          <strong>
            {new Date(Date.now() + 345600000).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </strong>
        </p>

        <button className='product__buy' onClick={buyHandler}>
        Buy Now
        </button>

        <p><small>Ships from</small> NewAge</p>
        <p><small>Sold by</small> NewAge</p>

        {order && (
            <div className='product__bought'>
              Item bought on <br />
              <strong>
                {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                  undefined,
                  {
                    weekday: 'long',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                  })}
              </strong>
            </div>
          )}

      </div>

      <button onClick={togglePop} className="product__close">
        <img src={close} alt="Close" />
      </button>
      </div>

    </div>
  );
}

export default Product;