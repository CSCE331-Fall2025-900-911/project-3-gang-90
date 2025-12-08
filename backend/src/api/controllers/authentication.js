import { OAuth2Client } from 'google-auth-library'
import dotenv from 'dotenv'
dotenv.config()

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
)

export async function googleAuth(req, res) {
  try {
    const { id_token } = req.body

    if (id_token) {
      try {
        const ticket = await oAuth2Client.verifyIdToken({
          idToken: id_token,
          audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload()
        return res.json({ ok: true, source: 'id_token', user: payload })
      } catch (verifyErr) {
        console.error('ID token verify error:', verifyErr)
        return res.status(400).json({ error: 'Invalid id_token', details: verifyErr.message })
      }
    }

    return res.status(400).json({ error: 'Missing id_token or code' })
  } catch (err) {
    console.error('googleAuth unexpected error:', err)
    return res.status(500).json({ error: 'google token exchange failed', details: err.message })
  }
}

export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' })
    oAuth2Client.setCredentials({ refresh_token: refreshToken })
    const r = await oAuth2Client.refreshToken(refreshToken).catch(() => null)
    if (r && r.tokens) return res.json(r.tokens)
    return res.status(501).json({ error: 'refreshToken not implemented for this client library version' })
  } catch (err) {
    console.error('refreshToken error:', err)
    return res.status(500).json({ error: 'refresh token exchange failed', details: err.message })
  }
}

export async function authMe(req, res) {
  try {
    const authHeader = req.headers.authorization || ''
    const m = authHeader.match(/^Bearer\s+(.*)$/i)
    const idToken = m ? m[1] : null
    if (!idToken) return res.status(401).json({ error: 'Unauthorized: missing token' })

    const ticket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    return res.json({ ok: true, user: payload })
  } catch (err) {
    console.error('authMe error:', err)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

