import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const Router = useRouter();
  useEffect(()=>{
    Router.push("/admin-panel")
  }, []);
  return (
    <div style={{backgroundColor: "black", height: "100%", width: "100%"}}>
    </div>
  )
}
