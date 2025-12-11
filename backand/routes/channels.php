<?php

use Illuminate\Support\Facades\Broadcast;

// Public chat channel - no authentication required
Broadcast::channel('chat', function () {
    return true;
});
