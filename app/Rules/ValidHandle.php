<?php

namespace App\Rules;

use App\Support\Helpers\StringHelper;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Validates handle format using centralized StringHelper logic.
 * Ensures consistency across registration and settings updates.
 */
class ValidHandle implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param string $attribute
     * @param mixed $value
     * @param \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $result = StringHelper::validateHandle($value);

        if (!$result['valid']) {
            $fail($result['message']);
        }
    }
}
