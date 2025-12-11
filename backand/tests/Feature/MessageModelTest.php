<?php

use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('message can be created with valid data', function () {
    $message = Message::create([
        'name' => 'Test User',
        'message' => 'Test message',
        'ip_address' => '127.0.0.1',
    ]);

    expect($message)->toBeInstanceOf(Message::class)
        ->and($message->name)->toBe('Test User')
        ->and($message->message)->toBe('Test message')
        ->and($message->ip_address)->toBe('127.0.0.1')
        ->and($message->id)->toBeInt()
        ->and($message->created_at)->not->toBeNull()
        ->and($message->updated_at)->not->toBeNull();
});

test('message can be updated', function () {
    $message = Message::create([
        'name' => 'Original Name',
        'message' => 'Original message',
        'ip_address' => '127.0.0.1',
    ]);

    $originalUpdatedAt = $message->updated_at;

    // Wait a moment to ensure timestamp changes
    sleep(1);

    $message->update([
        'name' => 'Updated Name',
        'message' => 'Updated message',
        'ip_address' => '192.168.1.1',
    ]);

    expect($message->name)->toBe('Updated Name')
        ->and($message->message)->toBe('Updated message')
        ->and($message->ip_address)->toBe('192.168.1.1')
        ->and($message->updated_at)->not->toEqual($originalUpdatedAt);
});

test('message can be deleted', function () {
    $message = Message::create([
        'name' => 'User to Delete',
        'message' => 'Message to delete',
        'ip_address' => '127.0.0.1',
    ]);

    $messageId = $message->id;
    $message->delete();

    expect(Message::find($messageId))->toBeNull();
});

test('message can store long text', function () {
    $longMessage = str_repeat('A', 10000);

    $message = Message::create([
        'name' => 'Long Text User',
        'message' => $longMessage,
        'ip_address' => '127.0.0.1',
    ]);

    expect($message->message)->toBe($longMessage)
        ->and(strlen($message->message))->toBe(10000);
});

test('message timestamps are automatically set', function () {
    $message = Message::create([
        'name' => 'Test User',
        'message' => 'Test',
        'ip_address' => '127.0.0.1',
    ]);

    expect($message->created_at)->not->toBeNull()
        ->and($message->updated_at)->not->toBeNull()
        ->and($message->created_at)->toBeInstanceOf(\Illuminate\Support\Carbon::class)
        ->and($message->updated_at)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
});

test('message can be retrieved from database', function () {
    $created = Message::create([
        'name' => 'Retrievable User',
        'message' => 'Retrievable message',
        'ip_address' => '127.0.0.1',
    ]);

    $retrieved = Message::find($created->id);

    expect($retrieved)->not->toBeNull()
        ->and($retrieved->name)->toBe('Retrievable User')
        ->and($retrieved->message)->toBe('Retrievable message')
        ->and($retrieved->ip_address)->toBe('127.0.0.1')
        ->and($retrieved->id)->toBe($created->id);
});

test('message can be created without name', function () {
    $message = Message::create([
        'message' => 'Message without name',
        'ip_address' => '127.0.0.1',
    ]);

    expect($message->name)->toBeNull()
        ->and($message->message)->toBe('Message without name');
});

test('message can be created without ip_address', function () {
    $message = Message::create([
        'name' => 'Test User',
        'message' => 'Message without IP',
    ]);

    expect($message->ip_address)->toBeNull()
        ->and($message->message)->toBe('Message without IP');
});

