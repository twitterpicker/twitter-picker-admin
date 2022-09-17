import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {

  // go to "/admin-panel" on first render of "/"
  const Router = useRouter();
  useEffect(()=>{
    Router.push("/admin-panel")
  }, []);


  return (
    <div style={{backgroundColor: "black", height: "100%", width: "100%"}}>
    </div>
  )
}
