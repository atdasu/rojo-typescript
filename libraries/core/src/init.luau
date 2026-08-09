-- Compiled with roblox-ts v3.0.0
--* Creates the shared greeting used by the starter game. 
local function createGreeting(projectName)
	return `Hello from {projectName}!`
end
return {
	createGreeting = createGreeting,
}
