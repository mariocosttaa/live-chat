<?php

use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Set up any necessary test data
});

test('can get all messages', function () {
    // Create some test messages
    Message::create(['name' => 'User1', 'message' => 'First message', 'ip_address' => '127.0.0.1']);
    Message::create(['name' => 'User2', 'message' => 'Second message', 'ip_address' => '127.0.0.1']);
    Message::create(['name' => 'User3', 'message' => 'Third message', 'ip_address' => '127.0.0.1']);

    $response = $this->getJson('/api/messages');

    $response->assertStatus(200)
        ->assertJsonCount(3)
        ->assertJsonStructure([
            '*' => [
                'id',
                'name',
                'message',
                'ip_address',
                'created_at',
                'updated_at',
            ],
        ]);
});

test('messages are returned in ascending order by created_at', function () {
    $first = Message::create(['name' => 'User1', 'message' => 'First', 'ip_address' => '127.0.0.1']);
    sleep(1);
    $second = Message::create(['name' => 'User2', 'message' => 'Second', 'ip_address' => '127.0.0.1']);
    sleep(1);
    $third = Message::create(['name' => 'User3', 'message' => 'Third', 'ip_address' => '127.0.0.1']);

    $response = $this->getJson('/api/messages');

    $response->assertStatus(200);
    $messages = $response->json();

    expect($messages[0]['id'])->toBe($first->id)
        ->and($messages[1]['id'])->toBe($second->id)
        ->and($messages[2]['id'])->toBe($third->id);
});

test('can create a new message', function () {
    Event::fake();

    $response = $this->postJson('/api/messages', [
        'name' => 'John Doe',
        'message' => 'Hello, World!',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'id',
            'name',
            'message',
            'ip_address',
            'created_at',
            'updated_at',
        ])
        ->assertJson([
            'name' => 'John Doe',
            'message' => 'Hello, World!',
        ]);

    $this->assertDatabaseHas('messages', [
        'name' => 'John Doe',
        'message' => 'Hello, World!',
    ]);

    // Verify IP address was captured
    expect($response->json('ip_address'))->not->toBeNull();

    // Verify event was dispatched
    Event::assertDispatched(\App\Events\MessageSent::class);
});

test('creating message requires message field', function () {
    $response = $this->postJson('/api/messages', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['message']);
});

test('name field is required when creating message', function () {
    $response = $this->postJson('/api/messages', [
        'message' => 'Message without name',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

test('name field cannot exceed max length', function () {
    $longName = str_repeat('A', 256); // Exceeds 255 character limit

    $response = $this->postJson('/api/messages', [
        'name' => $longName,
        'message' => 'Test message',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

test('message field must be a string', function () {
    $response = $this->postJson('/api/messages', [
        'message' => 12345,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['message']);
});

test('message field cannot exceed max length', function () {
    $longMessage = str_repeat('A', 10001); // Exceeds 10000 character limit

    $response = $this->postJson('/api/messages', [
        'message' => $longMessage,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['message']);
});

test('can get a single message by id', function () {
    $message = Message::create(['name' => 'Test User', 'message' => 'Test message', 'ip_address' => '127.0.0.1']);

    $response = $this->getJson("/api/messages/{$message->id}");

    $response->assertStatus(200)
        ->assertJson([
            'id' => $message->id,
            'name' => 'Test User',
            'message' => 'Test message',
            'ip_address' => '127.0.0.1',
        ]);
});

test('returns 404 for non-existent message', function () {
    $response = $this->getJson('/api/messages/99999');

    $response->assertStatus(404);
});

test('can update an existing message', function () {
    Event::fake();

    $message = Message::create(['name' => 'Original Name', 'message' => 'Original message', 'ip_address' => '127.0.0.1']);

    $response = $this->putJson("/api/messages/{$message->id}", [
        'name' => 'Updated Name',
        'message' => 'Updated message',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'id' => $message->id,
            'name' => 'Updated Name',
            'message' => 'Updated message',
        ]);

    $this->assertDatabaseHas('messages', [
        'id' => $message->id,
        'name' => 'Updated Name',
        'message' => 'Updated message',
    ]);

    // Verify event was dispatched
    Event::assertDispatched(\App\Events\MessageSent::class);
});

test('updating message requires message field', function () {
    $message = Message::create(['message' => 'Original']);

    $response = $this->putJson("/api/messages/{$message->id}", []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['message']);
});

test('returns 404 when updating non-existent message', function () {
    $response = $this->putJson('/api/messages/99999', [
        'message' => 'Updated',
    ]);

    $response->assertStatus(404);
});

test('can delete a message', function () {
    $message = Message::create(['message' => 'Message to delete']);

    $response = $this->deleteJson("/api/messages/{$message->id}");

    $response->assertStatus(204);

    $this->assertDatabaseMissing('messages', [
        'id' => $message->id,
    ]);
});

test('returns 404 when deleting non-existent message', function () {
    $response = $this->deleteJson('/api/messages/99999');

    $response->assertStatus(404);
});

test('can handle empty messages list', function () {
    $response = $this->getJson('/api/messages');

    $response->assertStatus(200)
        ->assertJsonCount(0);
});

test('message can contain special characters', function () {
    $specialMessage = 'Hello! @#$%^&*()_+-=[]{}|;:,.<>?/`~"\'\\';

    $response = $this->postJson('/api/messages', [
        'name' => 'Special User',
        'message' => $specialMessage,
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'name' => 'Special User',
            'message' => $specialMessage,
        ]);
});

test('message can contain unicode characters', function () {
    $unicodeMessage = 'Hello 世界 🌍 مرحبا';

    $response = $this->postJson('/api/messages', [
        'name' => 'Unicode User 用户',
        'message' => $unicodeMessage,
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'name' => 'Unicode User 用户',
            'message' => $unicodeMessage,
        ]);
});

test('message can contain newlines', function () {
    $multilineMessage = "Line 1\nLine 2\nLine 3";

    $response = $this->postJson('/api/messages', [
        'name' => 'Multiline User',
        'message' => $multilineMessage,
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'name' => 'Multiline User',
            'message' => $multilineMessage,
        ]);
});

test('ip address is automatically captured when creating message', function () {
    $response = $this->postJson('/api/messages', [
        'name' => 'Test User',
        'message' => 'Test message',
    ]);

    $response->assertStatus(201);
    $message = $response->json();

    expect($message['ip_address'])->not->toBeNull()
        ->and($message['ip_address'])->toBeString();
});

