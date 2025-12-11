<?php

use App\Models\Message;

test('message has fillable attributes', function () {
    $message = new Message();

    expect($message->getFillable())->toContain('name')
        ->and($message->getFillable())->toContain('message')
        ->and($message->getFillable())->toContain('ip_address');
});

test('message model exists', function () {
    expect(class_exists(Message::class))->toBeTrue();
});

test('message model extends eloquent model', function () {
    $message = new Message();

    expect($message)->toBeInstanceOf(\Illuminate\Database\Eloquent\Model::class);
});

