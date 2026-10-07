local Lifetime = require("../out/client/Lifetime").Lifetime

local checks = 0
local function check(value, label)
	assert(value, label)
	checks += 1
end

-- A stand-in for RBXScriptSignal that counts its live connections.
local function signal()
	local bus = { callbacks = {} }

	function bus:Connect(callback)
		local connection = { Connected = true }
		function connection.Disconnect()
			connection.Connected = false
		end
		table.insert(self.callbacks, { callback = callback, connection = connection })
		return connection
	end

	function bus:Fire()
		for _, entry in self.callbacks do
			if entry.connection.Connected then
				entry.callback()
			end
		end
	end

	function bus:Count()
		local count = 0
		for _, entry in self.callbacks do
			if entry.connection.Connected then
				count += 1
			end
		end
		return count
	end

	return bus
end

local function fakeInstance()
	return {
		inside = true,
		Destroying = signal(),
		AncestryChanged = signal(),
		IsDescendantOf = function(self)
			return self.inside
		end,
	}
end

for _, watchFirst in { true, false } do
	for _, mode in { "Destroy", "Unparent", "Explicit" } do
		local owner, cleanups = fakeInstance(), 0
		if watchFirst then
			Lifetime.watch(owner, {})
		end
		local stop = Lifetime.bind(owner, {}, function()
			cleanups += 1
		end)
		if not watchFirst then
			Lifetime.watch(owner, {})
		end

		owner.AncestryChanged:Fire()
		check(cleanups == 0, "Reparenting inside the root keeps the lifetime")

		if mode == "Destroy" then
			owner.Destroying:Fire()
		elseif mode == "Unparent" then
			owner.inside = false
			owner.AncestryChanged:Fire()
		else
			stop()
		end

		owner.Destroying:Fire()
		owner.AncestryChanged:Fire()
		stop()
		check(cleanups == 1, "Cleanup runs exactly once in any order")
		check(
			owner.Destroying:Count() == 0 and owner.AncestryChanged:Count() == 0,
			"All listeners are released"
		)
	end
end

local removed, cleanups = fakeInstance(), 0
removed.inside = false
Lifetime.bind(removed, {}, function()
	cleanups += 1
end)
check(cleanups == 1, "An owner already outside the root cleans up immediately")

print(`PASS: lifetime ({checks} checks)`)
