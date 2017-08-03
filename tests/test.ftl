Solarsystem name:     ${solarsystem_data.name}
Solarsystem location: ${solarsystem_data.location}
Solarsystem age:      ${solarsystem_data.age}

The planets in our solarsystem:
<#list planets as planet>
${planet}
</#list>

<#include "./tests/test_include.ftl">