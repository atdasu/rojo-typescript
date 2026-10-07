local createReactiveState = require("../out/client/UI/ReactiveState").createReactiveState

-- A stand-in for Vide that counts writes across all sources.
local writes, batches = 0, 0
local fakeVide = {
	source = function(initial)
		local value = initial
		return function(...)
			if select("#", ...) == 0 then
				return value
			end
			value = ...
			writes += 1
			return value
		end
	end,
	batch = function(update)
		batches += 1
		update()
	end,
}

local state = createReactiveState(fakeVide, { Ammo = 3, Roster = { "a", "b" }, Clock = 0 })
local view = state()

assert(view.Ammo == 3 and view.Clock == 0, "Initial values are readable")
assert(state() == view, "The read view is stable")

state({ Ammo = 3, Roster = { "a", "b" }, Clock = 1 })
assert(view.Clock == 1, "Published values are visible")
assert(writes == 1, "Deeply equal fields are not republished")
assert(batches == 1, "A publish is one batch")

state({ Ammo = 2, Roster = { "a" } })
assert(view.Ammo == 2 and #view.Roster == 1, "Changed fields are republished")
assert(view.Clock == nil, "Fields missing from a snapshot are cleared")

local wrote = pcall(function()
	view.Ammo = 9
end)
assert(not wrote, "Views are read-only")

print("PASS: reactive-state")
