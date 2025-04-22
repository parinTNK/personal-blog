import { FaCircleCheck } from "react-icons/fa6";


function SingupSuccess() {
  return (
    <>
      <div className="flex flex-col items-center justify-center  rounded-2xl w-238 bg-gray-100 py-20 gap-4">
        <FaCircleCheck className="text-6xl text-green-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mx-10">Registration Successful!</h2>
        <button className="mt-10">
          <a href="/login" className="text-white  bg-black hover:bg-gray-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-10 py-3 text-center">
            Continue
          </a>
        </button>
      </div>
    </>
  )
}

export default SingupSuccess