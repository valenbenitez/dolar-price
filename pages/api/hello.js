import axios from "axios"

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ name: 'John Doe' })
  }

  if (req.method === 'POST') {
    res.status(200).json({ req: 'POST' })
  }

}
