export function auth() {
    return {
        // headers: {
        //   Authorization: `Token ${localStorage.token}`
        // }
    }
}

let permissions

export function checkPermission(permission) {
    if (!permissions) {
        permissions = JSON.parse(localStorage.getItem('permissions'))
    }

    return permissions.includes(permission)
}

export function clearPermissions() {
    permissions = undefined
}

export function signIn({ user, token }) {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
}

export function signOut(history) {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    clearPermissions()
    history.push('/')
}

export function isAuthenticated() {
    return localStorage.getItem('token')
}
