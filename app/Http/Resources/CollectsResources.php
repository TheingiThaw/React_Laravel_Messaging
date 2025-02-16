<?php

namespace Illuminate\Http\Resources;

trait CollectsResources
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array
     */
    public function toArray($request)
    {
        if (is_null($this->collection) || $this->collection->isEmpty()) {
            \Log::warning('Collection is null or empty');
            return [];
        }

        return $this->collection->map->toArray($request)->all();
    }
}
