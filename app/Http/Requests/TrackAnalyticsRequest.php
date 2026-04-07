<?php

namespace App\Http\Requests;

use App\Models\AnalyticsEvent;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TrackAnalyticsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'event_type' => ['required', Rule::in([AnalyticsEvent::PHOTO_VIEW])],
            'trackable_id' => ['required', 'integer', 'exists:photos,id'],
        ];
    }
}
