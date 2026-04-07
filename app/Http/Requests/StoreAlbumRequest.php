<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAlbumRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'tournament_id' => ['nullable', 'integer', 'exists:tournaments,id'],
            'opponent' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
        ];
    }
}
