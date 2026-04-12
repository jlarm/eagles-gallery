import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\QueueController::retryFailed
* @see app/Http/Controllers/QueueController.php:12
* @route '/queue/retry-failed'
*/
export const retryFailed = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryFailed.url(options),
    method: 'post',
})

retryFailed.definition = {
    methods: ["post"],
    url: '/queue/retry-failed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\QueueController::retryFailed
* @see app/Http/Controllers/QueueController.php:12
* @route '/queue/retry-failed'
*/
retryFailed.url = (options?: RouteQueryOptions) => {
    return retryFailed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QueueController::retryFailed
* @see app/Http/Controllers/QueueController.php:12
* @route '/queue/retry-failed'
*/
retryFailed.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryFailed.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QueueController::retryFailed
* @see app/Http/Controllers/QueueController.php:12
* @route '/queue/retry-failed'
*/
const retryFailedForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryFailed.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QueueController::retryFailed
* @see app/Http/Controllers/QueueController.php:12
* @route '/queue/retry-failed'
*/
retryFailedForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryFailed.url(options),
    method: 'post',
})

retryFailed.form = retryFailedForm

/**
* @see \App\Http\Controllers\QueueController::clearFailed
* @see app/Http/Controllers/QueueController.php:19
* @route '/queue/clear-failed'
*/
export const clearFailed = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearFailed.url(options),
    method: 'post',
})

clearFailed.definition = {
    methods: ["post"],
    url: '/queue/clear-failed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\QueueController::clearFailed
* @see app/Http/Controllers/QueueController.php:19
* @route '/queue/clear-failed'
*/
clearFailed.url = (options?: RouteQueryOptions) => {
    return clearFailed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QueueController::clearFailed
* @see app/Http/Controllers/QueueController.php:19
* @route '/queue/clear-failed'
*/
clearFailed.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearFailed.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QueueController::clearFailed
* @see app/Http/Controllers/QueueController.php:19
* @route '/queue/clear-failed'
*/
const clearFailedForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clearFailed.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QueueController::clearFailed
* @see app/Http/Controllers/QueueController.php:19
* @route '/queue/clear-failed'
*/
clearFailedForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clearFailed.url(options),
    method: 'post',
})

clearFailed.form = clearFailedForm

/**
* @see \App\Http\Controllers\QueueController::retryPhoto
* @see app/Http/Controllers/QueueController.php:26
* @route '/queue/retry-photo/{photo}'
*/
export const retryPhoto = (args: { photo: number | { id: number } } | [photo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryPhoto.url(args, options),
    method: 'post',
})

retryPhoto.definition = {
    methods: ["post"],
    url: '/queue/retry-photo/{photo}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\QueueController::retryPhoto
* @see app/Http/Controllers/QueueController.php:26
* @route '/queue/retry-photo/{photo}'
*/
retryPhoto.url = (args: { photo: number | { id: number } } | [photo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { photo: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { photo: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            photo: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        photo: typeof args.photo === 'object'
        ? args.photo.id
        : args.photo,
    }

    return retryPhoto.definition.url
            .replace('{photo}', parsedArgs.photo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\QueueController::retryPhoto
* @see app/Http/Controllers/QueueController.php:26
* @route '/queue/retry-photo/{photo}'
*/
retryPhoto.post = (args: { photo: number | { id: number } } | [photo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryPhoto.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QueueController::retryPhoto
* @see app/Http/Controllers/QueueController.php:26
* @route '/queue/retry-photo/{photo}'
*/
const retryPhotoForm = (args: { photo: number | { id: number } } | [photo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryPhoto.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QueueController::retryPhoto
* @see app/Http/Controllers/QueueController.php:26
* @route '/queue/retry-photo/{photo}'
*/
retryPhotoForm.post = (args: { photo: number | { id: number } } | [photo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: retryPhoto.url(args, options),
    method: 'post',
})

retryPhoto.form = retryPhotoForm

const queue = {
    retryFailed: Object.assign(retryFailed, retryFailed),
    clearFailed: Object.assign(clearFailed, clearFailed),
    retryPhoto: Object.assign(retryPhoto, retryPhoto),
}

export default queue