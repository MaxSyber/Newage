import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Newage from './abis/Newage.json'

// Config
import config from './config.json'

function App() {

  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [newage, setNewage] = useState(null)

  const [mice, setMice] = useState(null)
  const [landscapes, setLandscapes] = useState(null)
  const [space, setSpace] = useState(null)

  const [item, setItem] = useState({})
  const[toggle, setToggle] = useState(false)

  const togglePop= (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()
    
    const newage = new ethers.Contract(
      config[network.chainId].newage.address,
      Newage,
      provider
      )
    setNewage(newage)
    
    const items = []
    for (var i = 0; i < 9; i++) {
      const item = await newage.items(i + 1)
      items.push(item)
    }
    console.log(items)
    
    const mice = items.filter((item) => item.category === 'mice')
    const landscapes = items.filter((item) => item.category === 'landscape')
    const space = items.filter((item) => item.category === 'space')
    
    setMice(mice)
    setLandscapes(landscapes)
    setSpace(space)
    console.log(mice)
    console.log(landscapes)
    console.log(space)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>

      <Navigation account = {account} setAccount={setAccount}/>

      <h2>NewAge Best AI Artworks</h2>
      
       {mice && landscapes && space && (
          <>
           <Section title= {"Animals"} items={mice} togglePop={togglePop} />
           <Section title= {"Landscapes"} items={landscapes} togglePop={togglePop} />
           <Section title= {"Space"} items={space} togglePop={togglePop} />
          </>
        )}
        {toggle && (
          <Product item={item} provider={provider} account={account} newage={newage} togglePop={togglePop} />
            )}
    </div>
  );
}

export default App;
