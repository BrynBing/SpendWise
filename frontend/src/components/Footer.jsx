import React from 'react'

export default function Footer() {
  return (
   <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
  <aside>
    <p>Copyright © {new Date().getFullYear()} - All right reserved by SpendWise</p>
  </aside>
</footer>
  )
}
