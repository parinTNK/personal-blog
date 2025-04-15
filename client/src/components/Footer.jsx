import {
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
function Footer() {
  return (
    <>
      <footer className="bg-[#EFEEEB] px-8 py-8 md:py-14 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex flex-row items-center space-x-4 justify-between container mx-auto">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <span className="font-medium">Get in touch</span>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-muted-foreground">
              <Linkedin size={16} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="#" className="hover:text-muted-foreground">
              <Github size={16} />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="#" className="hover:text-muted-foreground">
              <Mail size={16} />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
        <a href="/" className="hover:text-muted-foreground font-medium underline">
          Home page
        </a>
        </div>
      </footer>
    </>
  )
}

export default Footer