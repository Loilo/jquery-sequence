# jquery-sequence
Runs a callback on each element of a jQuery collection with a timer in between

Use it like this:

```javascript
$( ".selector" ).sequence( callback, 500 );
```

This will apply your `callback` function on each element of the collection with a delay of 500ms between each call.

You can find a small interactive playground [here](http://loilo.github.io/jquery-sequence/).

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
Calling `.sequence( [...] )` returns a sequence controller object (called `ctrl` below).
It contains a `$.Deferred()` promise as the `ctrl.promise` property, so you can run the familiar jQuery promise-like methods to determine when the sequence finishes.

Additionally, there are the following methods appended:

#### `ctrl.hold()`
Pauses the execution of the sequence instantly.

#### `ctrl.release( [ when = "now" ] )`
Unpauses the execution of the sequence.
The `when` parameter can either be
- `"now"` to execute the next call on the sequence immediately (default)
- `"delayed"` to wait a full turn and then run the callback or
- `"remaining"` to resume exactly at the point where the execution was put on hold.

#### `ctrl.runAll()`
Runs all remaining calls immediately.
The `ctrl.promise` will be resolved.

#### `ctrl.cancel()`
Puts the execution on hold and clears the sequence queue. The `ctrl.promise` will be rejected.

#### `ctrl.reset()`
Resets the sequence and removes all promise handlers. Be aware that the changes made by the previous sequence calls naturally can't be reverted by this.