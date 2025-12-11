<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $messages = Message::orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'message' => 'required|string|max:10000',
        ]);

        // Get IP address from request
        $validated['ip_address'] = $request->ip();

        $message = Message::create($validated);

        // Broadcast the new message to all connected clients
        broadcast(new \App\Events\MessageSent($message));

        return response()->json($message, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $message = Message::findOrFail($id);

        return response()->json($message);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $message = Message::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'message' => 'required|string|max:10000',
        ]);

        // Update IP address if provided, otherwise keep existing
        if ($request->has('ip_address')) {
            $validated['ip_address'] = $request->ip();
        }

        $message->update($validated);

        // Broadcast the updated message
        broadcast(new \App\Events\MessageSent($message));

        return response()->json($message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $message = Message::findOrFail($id);
        $message->delete();

        return response()->json(null, 204);
    }
}
