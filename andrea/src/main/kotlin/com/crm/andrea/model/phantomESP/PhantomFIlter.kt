package com.crm.andrea.model.phantomESP

import com.fasterxml.jackson.annotation.JsonProperty

data class PhantomFilter(
    @JsonProperty("fullName") val fullName: String?
)
