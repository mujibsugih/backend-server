import { isSessionExists, createSession, getSession, deleteSession, isLogedin } from './../whatsapp.js'
import response from './../response.js'

const find = (req, res) => {
    if (isLogedin(req.params.id)) {
        return response(res, 200, true, 'Session found.')
    }

    response(res, 404, false, 'Session not found.')
}

const statuskonek = async (req, res) => {
    const session = getSession(req.params.id)

    if (isLogedin(req.params.id)) {
        try {
            const getimg = await session.profilePictureUrl(req.params.id+"@c.us")
            const haa = await session.state

            if (!haa) {
                const haaa = await session.user
                return response(res, 200, true, getimg, haaa)
            }else{
                return response(res, 200, true, getimg, haa)
            }

            
        } catch {
            //response(res, 500, false, 'Failed messages.')
        }
    
    }
    response(res, 404, false, 'koneksi terputus')

}

const add = (req, res) => {
    const { id, isLegacy } = req.body

    if (isLogedin(id)) {
        return response(res, 409, false, 'Session already exists, please use another id.')
    }

    createSession(id, isLegacy === 'true', res)
}

const del = async (req, res) => {
    const { id } = req.params
    const session = getSession(id)

    if (session) {
        try {
            await session.logout()
        } catch {
        } finally {
            deleteSession(id, session.isLegacy)
        }
    }

    response(res, 200, true, 'The session has been successfully deleted.')
}

export { find, add, del, statuskonek }
