import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A wrapper for fetch that adds the Authorization header if a token is present in localStorage.
 * Handles token refresh if the token is expired.
 * Usage: authFetch(url, options)
 */
export async function authFetch(url: string, options: RequestInit = {}) {
  try {
    const token = localStorage.getItem('token')
    
    // Construct the full API URL
    let fullUrl = url
    if (url.startsWith('/')) {
      // If it's a relative path, prepend the backend API base URL
      const baseApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000'
      fullUrl = baseApiUrl.replace(/\/$/, '') + url
    }
    
    console.log('Making API call to:', fullUrl)
    
    let headers: any = {
      ...options.headers,
    }
    
    // Only add Authorization header if token exists and is not null/undefined
    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // If body is FormData, do not set Content-Type (browser will set it)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }
    
    // Set up the request options with proper CORS handling
    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include' as RequestCredentials, // Include cookies for CORS requests
      mode: 'cors' as RequestMode // Explicitly set CORS mode
    }
    
    let response = await fetch(fullUrl, requestOptions)
    
    // Handle token refresh if unauthorized
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const baseApiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000'
          const refreshResponse = await fetch(`${baseApiUrl}/api/user/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
            credentials: 'include' as RequestCredentials,
            mode: 'cors'
          })
          
          if (refreshResponse.ok) {
            const data = await refreshResponse.json()
            localStorage.setItem('token', data.access_token)
            
            // Retry the original request with the new token
            headers['Authorization'] = `Bearer ${data.access_token}`
            requestOptions.headers = headers
            response = await fetch(fullUrl, requestOptions)
          } else {
            // If refresh token is invalid, redirect to login
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
        } catch (error) {
          console.error('Error refreshing token:', error)
        }
      } else {
        // No refresh token available, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    } else if (response.status === 500) {
      // Log detailed information about server errors
      console.error(`Server error when calling ${fullUrl}:`, {
        status: response.status,
        statusText: response.statusText
      })
      try {
        // Try to get more details from the response body
        const errorText = await response.clone().text()
        console.error('Server error details:', errorText)
      } catch (e) {
        console.error('Could not read error details from response')
      }
    }
    
    // Return the response object so calling code can handle it properly
    return response
  } catch (error) {
    console.error(`Network error when fetching ${url}:`, error)
    // Create a Response object to return so the calling code can handle it consistently
    return new Response(JSON.stringify({ error: 'Network error occurred. Please check your connection and try again.' }), {
      status: 500,
      statusText: 'Network Error',
      headers: new Headers({ 'Content-Type': 'application/json' })
    })
  }
}
