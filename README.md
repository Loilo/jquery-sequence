# jquery-sequence
Runs a callback on each element of a jQuery collection with a timer in between

Use it like this:

```
$( ".selector" ).sequence( callback, 500 );
```

This will apply your `callback` function on each element of the collection with a delay of 500ms between each call.

# Usage

## Get started
`.sequence()` takes 3 arguments:

### callback
The callback function to run over each element of the given collection. The `this` argument of the call will be the current element, just like it is in `jQuery.each`.

### speed
The interval between each call in milliseconds.

### instantly
An optional boolean, defaulting to `true`. Tells if the sequence should run as it is created or be `hold()` (see below) immediately to wait for further commands.


## Control the sequence
`.sequence()` returns a sequence controller object which is basically a `jQuery.Deferred()` loaded with some extra methods.
You can run the familiar jQuery promise-like methods on the controller to determine when the sequence finishes.

Additionally, there are the following methods appended:

### .hold()
Pauses the execution of the sequence instantly.

### .release( [ when = "now" ] )
Unpauses the execution of the sequence.
The `when` parameter can either be
- `"now"` to execute the next call on the sequence immediately (default)
- `"delayed"` to wait a full turn and then run the callback or
- `"remaining"` to resume exactly at the point where the execution was put on hold.

### .runAll()
Runs all remaining calls immediately.
The promise will be resolved.

### .clear()
Puts the execution on hold and clears the sequence queue. The promise will be rejected.