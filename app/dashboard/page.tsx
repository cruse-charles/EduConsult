import Sidebar from "../components/Sidebar"

const page = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-white">
        {/* Your main dashboard content goes here */}
      </div>
    </div>
  )
}

export default page