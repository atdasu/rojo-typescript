-- Runs the offline tests in tests/ against the compiled Luau in out/.
-- Pass names to run a subset: `lune run test core`.
local fs = require("@lune/fs")
local process = require("@lune/process")

local TESTS = "tests"
local SUFFIX = ".luau"

if not fs.isDir("out") then
	print("out/ is missing. Run `pnpm run build` first, or use `pnpm test`.")
	process.exit(1)
end

local selected = {}
for _, name in process.args do
	selected[name] = true
end

local tests = {}
for _, entry in fs.readDir(TESTS) do
	local name = string.sub(entry, 1, -#SUFFIX - 1)
	local isTest = fs.isFile(`{TESTS}/{entry}`) and string.sub(entry, -#SUFFIX) == SUFFIX
	if isTest and (#process.args == 0 or selected[name]) then
		table.insert(tests, name)
	end
end
table.sort(tests)

if #tests == 0 then
	print("No matching tests found.")
	process.exit(1)
end

-- Each test runs in its own process so one failure cannot affect another.
local failed = {}
for _, name in tests do
	print(`> lune run {TESTS}/{name}`)
	if not process.exec("lune", { "run", `{TESTS}/{name}` }, { stdio = "inherit" }).ok then
		table.insert(failed, name)
	end
end

if #failed > 0 then
	print(`\n{#failed} of {#tests} tests failed: {table.concat(failed, ", ")}`)
	process.exit(1)
end

print(`\nAll {#tests} tests passed.`)
