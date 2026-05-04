<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestImage extends Model
{
    use HasFactory;

    protected $table = 'request_images';

    public $timestamps = false;

    protected $fillable = [
        'request_id',
        'image_url',
        'is_primary',
        'uploaded_at',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'uploaded_at' => 'datetime',
        ];
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(WasteRequest::class, 'request_id');
    }
}
