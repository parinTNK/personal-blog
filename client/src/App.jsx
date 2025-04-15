import Home from './page/Home'
import ViewPost from './page/ViewPost'
import { BrowserRouter as Router, Route, Routes  } from "react-router-dom"

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view-post/:id" element={<ViewPost />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
