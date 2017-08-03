Solarsystem name:     ${solarsystem_data.name?upper_case}
Solarsystem location: ${solarsystem_data.location}
Solarsystem age:      ${solarsystem_data.age}

The planets in our solarsystem:
<#list planets as planet>
${planet?upper_case}
</#list>

<#include "./tests/test_include.ftl">